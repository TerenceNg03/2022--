package zju.se.management.entity;

import lombok.*;
import java.util.Date;
import javax.persistence.*;

@Entity
@Table(name="Arrange")
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
public class Arrange {

    public enum dayEnum {
        SUNDAY,
        MONDAY,
        TUESDAY,
        WEDNESDAY,
        THURSDAY,
        FRIDAY,
        SATURDAY
    }

    @Id
    @Column
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Temporal(TemporalType.TIME)
    private Date start_time;

    @Temporal(TemporalType.TIME)
    private Date end_time;

    @Column
    @Enumerated(EnumType.STRING)
    private dayEnum dayType;

    @ManyToOne(cascade = CascadeType.MERGE)
    @JoinColumn(name = "userId", referencedColumnName = "id")
    private User user;

}
